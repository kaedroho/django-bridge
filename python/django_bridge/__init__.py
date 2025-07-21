def format_version(version):
    if version[2] == 0:
        # Ignore patch if it's 0
        formatted = ".".join(str(x) for x in VERSION[:2])
    else:
        formatted = ".".join(str(x) for x in VERSION[:3])

    if version[3] != "final":
        mapping = {"alpha": "a", "beta": "b", "rc": "rc", "dev": ".dev"}
        formatted += mapping[version[3]] + str(version[4])

    return formatted


VERSION = (0, 5, 0, "final", 0)
__version__ = format_version(VERSION)
